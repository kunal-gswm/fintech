import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/update_service.dart';

final updateStateProvider = FutureProvider<UpdateInfo>((ref) async {
  return UpdateService.checkForUpdate();
});
