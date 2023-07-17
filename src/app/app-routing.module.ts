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
import { TimeTableContainerComponent } from './timetable-container/timetable-container.component';
import { TrackingComponent } from './tracking/tracking.component';
import { ExtraFreightComponent } from './extra-freight/extra-freight.component';
import { AutenticacaoGuard } from './autenticacao/autenticacao.guard';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';


const routes: Routes = [
  { path: '', canActivate: [AutenticacaoGuard], component: TrackingComponent },
  {path: 'login', component: LoginComponent },
  {path:'tracking',component:TrackingComponent},
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
  {path:'container',component:TimeTableContainerComponent},
  { path: 'extra', canActivate: [AutenticacaoGuard], component: ExtraFreightComponent },
  { path: 'cadastro', canActivate: [AutenticacaoGuard], component: CadastroComponent },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
