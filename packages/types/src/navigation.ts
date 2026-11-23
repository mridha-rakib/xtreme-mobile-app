/**
 * XTREME Concierge Types - Navigation & Screen Registry
 */

export type CustomerScreenId =
  | 'CUS-AUTH-01'
  | 'CUS-AUTH-02'
  | 'CUS-AUTH-03'
  | 'CUS-AUTH-04'
  | 'CUS-AUTH-05'
  | 'CUS-AUTH-06'
  | 'CUS-AUTH-07'
  | 'CUS-AUTH-08'
  | 'CUS-PRO-01'
  | 'CUS-PRO-02'
  | 'CUS-SUP-01'
  | 'CUS-LEG-01'
  | 'CUS-DISC-01'
  | 'CUS-DISC-02'
  | 'CUS-DISC-03'
  | 'CUS-DISC-04'
  | 'CUS-BKG-01'
  | 'CUS-BKG-02'
  | 'CUS-BKG-03'
  | 'CUS-BKG-04'
  | 'CUS-BKG-05'
  | 'CUS-BKG-06'
  | 'CUS-PAY-01'
  | 'CUS-PAY-02'
  | 'CUS-PAY-03'
  | 'CUS-CHG-01'
  | 'CUS-CHG-02'
  | 'CUS-TRIP-01'
  | 'CUS-TRIP-02'
  | 'CUS-CON-01'
  | 'CUS-CON-02'
  | 'CUS-CON-03'
  | 'CUS-CON-04'
  | 'CUS-CON-05';

export type StaffScreenId =
  | 'STF-AUTH-01'
  | 'STF-ASG-01'
  | 'STF-ASG-02'
  | 'STF-ASG-03'
  | 'STF-ASG-04'
  | 'STF-ASG-05';

export interface ScreenMetadata {
  id: CustomerScreenId | StaffScreenId;
  title: string;
  path: string;
  module?: string;
  description?: string;
}
