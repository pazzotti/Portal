import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderModule } from './header/header.module';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import { LiveFormDialogComponent } from './app/home/live-form-dialog/live-form-dialog.component';
import { ContratoTerminalFormDialogComponent } from './app/home/contrato_terminal/contrato-terminal-form-dialog.component';
import { ContratoTransportadoraFormDialogComponent } from './app/home/contrato_transportadora/contrato-transportadora-form-dialog.component';
import { OrigemFormDialogComponent } from './app/home/locais-origem/origem-form-dialog.component';
import { DestinoFormDialogComponent } from './app/home/locais-destino/destino-form-dialog.component';
import { CarrierFormDialogComponent } from './app/home/carriers/carriers-form-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AtualizarComponent } from './atualizar/atualizar.component';
import { Contrato_EADIComponent } from './contrato-eadi/contrato-eadi.component';
import { ContratoTerminalComponent } from './contrato-terminal/contrato-terminal.component';
import { Contrato_RedexComponent } from './contrato-redex/contrato-redex.component';
import { ContratoTransportadoraComponent } from './contrato-transportadora/contrato-transportadora.component';
import { Locais_OrigemComponent } from './locais-origem/locais-origem.component';
import { Locais_DestinoComponent } from './locais-destino/locais-destino.component';
import { FormularioLocaisComponent } from './formulario_locais/formulario_locais';
import { MilkRunSulComponent } from './milk_run_sul/milk_run_sul.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CarrierComponent } from './carriers/carriers.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DevolverVazioFormDialogComponent } from './app/home/devolver_vazio/devolver-vazio-form-dialog.component';
import { ContainerReuseFormDialogComponent } from './app/home/container_reuse/container-reuse-form-dialog.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CarregaJettaComponent } from './carrega-jetta/carrega-jetta.component';
import { CommonModule, DatePipe } from '@angular/common';





@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LiveFormDialogComponent,
    ContratoTransportadoraFormDialogComponent,
    OrigemFormDialogComponent,
    DestinoFormDialogComponent,
    CarrierFormDialogComponent,
    AtualizarComponent,
    Contrato_EADIComponent,
    ContratoTerminalComponent,
    DashboardComponent,
    Contrato_RedexComponent,
    ContratoTransportadoraComponent,
    Locais_OrigemComponent,
    Locais_DestinoComponent,
    FormularioLocaisComponent,
    MilkRunSulComponent,
    CarrierComponent,
    ContratoTerminalFormDialogComponent,
    DevolverVazioFormDialogComponent,
    ContainerReuseFormDialogComponent,
    CarregaJettaComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserModule,
    HeaderModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    HighchartsChartModule,
    MatDialogModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule,
    ProgressbarModule.forRoot()
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
