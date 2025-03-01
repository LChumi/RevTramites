import {Revision} from '@models/revision';

export interface Muestra {
  id:           string;
  barraMuestra: string;
  cantidad:     number;
  status:       boolean;
  revision:     Revision;
}
