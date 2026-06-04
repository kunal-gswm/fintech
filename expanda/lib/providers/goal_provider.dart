import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/goal.dart';
import '../services/hive_service.dart';
import 'package:uuid/uuid.dart';

const _uuid = Uuid();

final goalListProvider =
    NotifierProvider<GoalNotifier, List<Goal>>(() {
  return GoalNotifier();
});

class GoalNotifier extends Notifier<List<Goal>> {
  @override
  List<Goal> build() {
    return HiveService.getAllGoals();
  }

  Future<void> refresh() async {
    state = HiveService.getAllGoals();
  }

  List<Goal> get active => state.where((g) => !g.isArchived).toList();
  List<Goal> get archived => state.where((g) => g.isArchived).toList();

  Future<void> add({
    required String title,
    required double targetAmount,
    required String category,
    required DateTime deadline,
    String iconName = 'savings',
  }) async {
    final goal = Goal(
      id: _uuid.v4(),
      title: title,
      targetAmount: targetAmount,
      category: category,
      deadline: deadline,
      iconName: iconName,
    );
    await HiveService.addGoal(goal);
    state = HiveService.getAllGoals();
  }

  /// Add progress to a goal. Returns true if the goal just reached 100%.
  Future<bool> addProgress(String goalId, double amount) async {
    final goal = state.firstWhere((g) => g.id == goalId);
    final wasCompleted = goal.isCompleted;
    final newAmount =
        (goal.savedAmount + amount).clamp(0, goal.targetAmount).toDouble();
    final updated = goal.copyWith(savedAmount: newAmount);
    await HiveService.updateGoal(updated);
    state = HiveService.getAllGoals();
    return !wasCompleted && updated.isCompleted;
  }

  Future<void> archive(String goalId) async {
    final goal = state.firstWhere((g) => g.id == goalId);
    final updated = goal.copyWith(isArchived: true);
    await HiveService.updateGoal(updated);
    state = HiveService.getAllGoals();
  }

  Future<void> unarchive(String goalId) async {
    final goal = state.firstWhere((g) => g.id == goalId);
    final updated = goal.copyWith(isArchived: false);
    await HiveService.updateGoal(updated);
    state = HiveService.getAllGoals();
  }

  Future<void> update(Goal goal) async {
    await HiveService.updateGoal(goal);
    state = HiveService.getAllGoals();
  }

  Future<void> delete(String id) async {
    await HiveService.deleteGoal(id);
    state = HiveService.getAllGoals();
  }
}
