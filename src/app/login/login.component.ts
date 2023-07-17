import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticacaoService } from '../autenticacao/autenticacao.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  formGroup!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private servicoAutenticacao: AutenticacaoService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      login: [this.data?.itemsData?.login, [Validators.required, Validators.email]],
      senha: [this.data?.itemsData?.senha, [Validators.required, Validators.minLength(4)]],
    });
  }


  public async submit(): Promise<void> {
    console.log(this.formGroup)
    if (this.formGroup.invalid) {
      alert('Preencha os dados corretamente!')
      return;
    }
    try {
      await this.servicoAutenticacao.login(
        this.formGroup.value
      )
    } catch (excecao: any) {
      const mensagemErro = excecao?.error?.erro || 'Erro ao realizar o login!'
      alert(mensagemErro)
    }
  }

  public async logout(): Promise<void> {
    console.log(this.formGroup)
    try {
      await this.servicoAutenticacao.logout()
    } catch (excecao: any) {
      const mensagemErro = excecao?.error?.erro || 'Erro ao realizar o logout!'
      alert(mensagemErro)
    }
  }

}
