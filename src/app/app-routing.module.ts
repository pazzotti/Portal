import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtualizarComponent } from './atualizar/atualizar.component';
import { TelaUserComponent } from './tela-user/tela-user.component';
import { MilkRunSulComponent } from './milk_run_sul/milk_run_sul.component';
import { ContratoTransportadoraComponent } from './contrato-transportadora/contrato-transportadora.component';
import { FornecedoresComponent } from './fornecedores/fornecedores.component';
import { CarrierComponent } from './carriers/carriers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CarregaJettaComponent } from './carrega-jetta/carrega-jetta.component';
import { MilkRunSPComponent } from './milk-run-sp/milk-run-sp.component';
import { MilkRunARGComponent } from './milk-run-arg/milk-run-arg.component';
import { InterplantasComponent } from './interplantas/interplantas.component';
import { TimeTableComponent } from './timetable/timetable.component';
import { LocaisComponent } from './locais/locais.component';
import { VeiculosLabComponent } from './veiculos-lab/veiculos-lab.component';

const routes: Routes = [
  {path:'',component:TelaUserComponent},
  {path:'atualiza',component:AtualizarComponent},
  {path:'userScreen',component:TelaUserComponent},
  {path:'milk_sul',component:MilkRunSulComponent},
  {path:'contrato_Transportadora',component:ContratoTransportadoraComponent},
  {path:'fornecedores',component:FornecedoresComponent},
  {path:'carrier',component:CarrierComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'jetta',component:CarregaJettaComponent},
  {path:'milk_SP',component:MilkRunSPComponent},
  {path:'milk_ARG',component:MilkRunARGComponent},
  {path:'interplantas',component:InterplantasComponent},
  {path:'time',component:TimeTableComponent},
  {path:'locais',component:LocaisComponent},
  {path:'lab',component:VeiculosLabComponent},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
