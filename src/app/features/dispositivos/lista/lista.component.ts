import {Component, inject, OnInit, signal} from '@angular/core';
import {DispositivoService} from '@services/dispositivos/dispositivo.service';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {Dispositivo} from '@models/dispositivos/dispositivo';
import {ESTADOS_DISPOSITIVO, estadoSeverity, estadoLabel,EstadoDispositivo} from '@models/dispositivos/estado-dispositivo';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToolbarModule} from 'primeng/toolbar';
import {TableModule} from 'primeng/table';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {TagModule} from 'primeng/tag';
import {TooltipModule} from 'primeng/tooltip';
import {Router} from '@angular/router';
import {DialogModule} from 'primeng/dialog';
import {DispositivoFormComponent} from '@features/dispositivos/form/dispositivo-form/dispositivo-form.component';
import {Menu, MenuModule} from 'primeng/menu';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    ConfirmDialogModule,
    ToolbarModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    TagModule,
    TooltipModule,
    DialogModule,
    DispositivoFormComponent,
    MenuModule
  ],
  templateUrl: './lista.component.html',
  styles: ``
})
export class ListaComponent implements OnInit {

  private readonly dispositivoService = inject(DispositivoService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  dispositivos = signal<Dispositivo[]>([]);
  loading = signal(true);

  readonly estados = ESTADOS_DISPOSITIVO;
  readonly estadoSeverity = estadoSeverity;
  readonly estadoLabel = estadoLabel;

  mostrarDialog = signal(false);
  dispositivoEditandoId = signal<string | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  abrirNuevo(): void {
    this.dispositivoEditandoId.set(null);
    this.mostrarDialog.set(true);
  }

  abrirEditar(dispositivo: Dispositivo): void {
    this.dispositivoEditandoId.set(dispositivo.id);
    this.mostrarDialog.set(true);
  }

  onGuardado(): void {
    this.mostrarDialog.set(false);
    this.cargar(); // refresca la tabla
  }

  cargar(): void {
    this.loading.set(true);
    this.dispositivoService.findAll().subscribe({
      next: (data) => {
        this.dispositivos.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la lista de equipos' });
      },
    });
  }

  cambiarEstado(dispositivo: Dispositivo, estado: EstadoDispositivo): void {
    if (dispositivo.estadoActual === estado) return;

    this.dispositivoService.cambiarEstado(dispositivo.id, estado).subscribe({
      next: (actualizado) => {
        this.dispositivos.update(list =>
          list.map(d => d.id === actualizado.id ? actualizado : d)
        );
        this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: `Estado cambiado a ${estadoLabel(estado)}` });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cambiar el estado' });
      },
    });
  }

  confirmarEliminar(dispositivo: Dispositivo): void {
    this.confirmationService.confirm({
      header: 'Eliminar equipo',
      message: `¿Seguro que deseas eliminar el equipo con serial "${dispositivo.serial}"?`,
      icon: 'pi pi-exclamation-triangle',
      key: 'dispo-dialog',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.eliminar(dispositivo),
    });
  }

  private eliminar(dispositivo: Dispositivo): void {
    this.dispositivoService.delete(dispositivo.id).subscribe({
      next: () => {
        this.dispositivos.update(list => list.filter(d => d.id !== dispositivo.id));
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Equipo eliminado correctamente' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el equipo' });
      },
    });
  }

  irAPrestar(dispositivo: Dispositivo): void {
    this.router.navigate(['/prestamos/entregar'], { queryParams: { dispositivoId: dispositivo.id } });
  }

  readonly EstadoDispositivo = EstadoDispositivo;

  accionesMenu: MenuItem[] = [];

  abrirMenu(menu: Menu, event: Event, dispositivo: Dispositivo) {

    this.accionesMenu = [

      {
        label: 'Prestar',
        icon: 'pi pi-send',
        disabled: dispositivo.estadoActual !== EstadoDispositivo.DISPONIBLE,
        command: () => this.irAPrestar(dispositivo)
      },

      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.abrirEditar(dispositivo)
      },

      {
        label: 'Historial',
        icon: 'pi pi-history',
        routerLink: ['/prestamos/historial', dispositivo.serial]
      },

      {
        separator: true
      },

      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        style: { color: 'red' },
        command: () => this.confirmarEliminar(dispositivo)
      }

    ];

    menu.toggle(event);

  }
}
