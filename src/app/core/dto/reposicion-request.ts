import {ReposicionConfiteria} from '@dtos/reposicion-confiteria';
import {ConfiteriaRepor} from '@dtos/confiteria-repor';

export interface ReposicionRequest {
  repo: ReposicionConfiteria,
  detalles: ConfiteriaRepor[]
}
