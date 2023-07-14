import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderModule } from './header/header.module';
import { FormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import { ContratoTransportadoraFormDialogComponent } from './app/home/contrato_transportadora/contrato-transportadora-form-dialog.component';
import { CarrierFormDialogComponent } from './app/home/carriers/carriers-form-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AtualizarComponent } from './atualizar/atualizar.component';
import { ContratoTransportadoraComponent } from './contrato-transportadora/contrato-transportadora.component';
import { FornecedoresFormDialogComponent } from './app/home/fornecedores/fornecedores-form-dialog.component';
import { FormularioLocaisComponent } from './formulario_locais/formulario_locais';
import { MilkRunSulComponent } from './milk_run_sul/milk_run_sul.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CarrierComponent } from './carriers/carriers.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CarregaJettaComponent } from './carrega-jetta/carrega-jetta.component';
import { CommonModule, DatePipe } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FornecedoresComponent } from './fornecedores/fornecedores.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FeatherModule } from 'angular-feather';
import { Camera, ZapOff, Zap, Edit, Delete, PlusCircle } from 'angular-feather/icons';
import { MilkRunSPComponent } from './milk-run-sp/milk-run-sp.component';
import { MilkRunARGComponent } from './milk-run-arg/milk-run-arg.component';
import { InterplantasComponent } from './interplantas/interplantas.component';
import { TimeTableComponent } from './timetable/timetable.component';
import { LocaisComponent } from './locais/locais.component';
import { LocaisFormDialogComponent } from './app/home/locais/locais-form-dialog.component';
import { EditaFormDialogComponent } from './app/home/edita_timetable/edita_timetable-dialog.component';
import { MatInputModule } from '@angular/material/input';




const icons = {
  Camera,
  ZapOff,
  Zap,
  Edit,
  Delete,
  PlusCircle
};


@NgModule({
  declarations: [
    AppComponent,
    FornecedoresComponent,
    ContratoTransportadoraFormDialogComponent,
    CarrierFormDialogComponent,
    AtualizarComponent,
    DashboardComponent,
    ContratoTransportadoraComponent,
    FornecedoresFormDialogComponent,
    LocaisFormDialogComponent,
    FormularioLocaisComponent,
    EditaFormDialogComponent,
    MilkRunSulComponent,
    CarrierComponent,
    CarregaJettaComponent,
    MilkRunSPComponent,
    MilkRunARGComponent,
    InterplantasComponent,
    TimeTableComponent,
    LocaisComponent,

  ],
  imports: [
    FeatherModule.pick(icons),
    BrowserModule,
    MatFormFieldModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserModule,
    HeaderModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    HighchartsChartModule,
    MatDialogModule,
    MatInputModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
