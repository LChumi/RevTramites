import {Revision} from '@models/revision';

export interface Muestra {
  id:           string;
  barraBulto:   string;
  barraMuestra: string;
  cantidad:     number;
  status:       boolean;
  revision:     Revision;
  proceso:      string;
  fecha:        null;
  hora:         null;
}
