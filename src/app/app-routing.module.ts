import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AtualizarComponent } from './atualizar/atualizar.component';
import { TelaUserComponent } from './tela-user/tela-user.component';
import { MilkRunSulComponent } from './milk_run_sul/milk_run_sul.component';
import { Contrato_EADIComponent } from './contrato-eadi/contrato-eadi.component';
import { Contrato_RedexComponent } from './contrato-redex/contrato-redex.component';
import { ContratoTransportadoraComponent } from './contrato-transportadora/contrato-transportadora.component';
import { ContratoTerminalComponent } from './contrato-terminal/contrato-terminal.component';
import { FornecedoresComponent } from './fornecedores/fornecedores.component';
import { Locais_OrigemComponent } from './locais-origem/locais-origem.component';
import { CarrierComponent } from './carriers/carriers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CarregaJettaComponent } from './carrega-jetta/carrega-jetta.component';
import { MilkRunSPComponent } from './milk-run-sp/milk-run-sp.component';
import { MilkRunARGComponent } from './milk-run-arg/milk-run-arg.component';
import { InterplantasComponent } from './interplantas/interplantas.component';
import { TimeTableComponent } from './timetable/timetable.component';

const routes: Routes = [
  {path:'contratos',component:HomeComponent},
  {path:'',component:TelaUserComponent},
  {path:'atualiza',component:AtualizarComponent},
  {path:'userScreen',component:TelaUserComponent},
  {path:'milk_sul',component:MilkRunSulComponent},
  {path:'contrato_EADI',component:Contrato_EADIComponent},
  {path:'contrato_Redex',component:Contrato_RedexComponent},
  {path:'contrato_Transportadora',component:ContratoTransportadoraComponent},
  {path:'contrato_terminal',component:ContratoTerminalComponent},
  {path:'fornecedores',component:FornecedoresComponent},
  {path:'locais_origem',component:Locais_OrigemComponent},
  {path:'carrier',component:CarrierComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'jetta',component:CarregaJettaComponent},
  {path:'milk_SP',component:MilkRunSPComponent},
  {path:'milk_ARG',component:MilkRunARGComponent},
  {path:'interplantas',component:InterplantasComponent},
  {path:'time',component:TimeTableComponent},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
