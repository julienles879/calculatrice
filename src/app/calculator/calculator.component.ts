import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})

export class CalculatorComponent {
  calcul: string = '';
  result: string = '';
  unite: string = '';

  constructor() {
    const storedInput = localStorage.getItem('currentInput');
    if (storedInput) {
      this.calcul = storedInput;
    }
  }

  ajouterAuCalcul(value: string) {
    if (value === '=') {
      console.log('Évaluation du calcul...');
      this.evaluerCalcul();
    } else if (value === 'C') {
      console.log('Effacement de la saisie...');
      this.calcul = '';
      localStorage.removeItem('currentInput');
    } else {
      console.log('Ajout de la valeur ' + value + ' à la saisie...');
      this.calcul += value;
      localStorage.setItem('currentInput', this.calcul);
    }
  }

  evaluerCalcul() {
    try {
      console.log('Évaluation de ' + this.calcul + '...');
      this.result = eval(this.calcul);
      console.log('Résultat : ' + this.result);
      localStorage.setItem('currentInput', this.result);
    } catch (e) {
      console.log('Une erreur est survenue : ' + e);
      this.result = 'Erreur';
    }
  }
}