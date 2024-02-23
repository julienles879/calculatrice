import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})

export class CalculatorComponent {
  calculations: { titre: string, calcul: string, result: string, unite: string }[] = [];
  calcul: string = '';
  result: string = '';
  unite: string = '';
  titre: string = '';

  fichierChoisi: boolean = true;

  constructor() {
    const storedInputs = localStorage.getItem('calculations');
    if (storedInputs) {
      this.calculations = JSON.parse(storedInputs);
    }
  }

  ajouterAuCalcul(value: string) {
    if (value === '=') {
      console.log('Évaluation du calcul...');
      this.evaluerCalcul();
    } else if (value === 'C') {
      console.log('Effacement de la saisie...');
      this.calcul = '';
    } else if (value === 'sup') {
      console.log('Effacement complet...');
      this.calculations = [];
      localStorage.removeItem('calculations');
    } else {
      console.log('Ajout de la valeur ' + value + ' à la saisie...');
      this.calcul += value;
    }
  }

  evaluerCalcul() {
    try {
      console.log('Titre du calcul: ' + this.titre);
      console.log('Unité sélectionnée: ' + this.unite);
      console.log('Évaluation de ' + this.calcul + '...');
      this.result = eval(this.calcul);
      console.log('Résultat : ' + this.result);
      this.calculations.push({ titre: this.titre + ' (' + this.unite + ')', calcul: this.calcul, result: this.result, unite: this.unite });
      localStorage.setItem('calculations', JSON.stringify(this.calculations));
      this.calcul = ''; // Reset input after evaluation

    } catch (e) {
      console.log('Une erreur est survenue : ' + e);
      this.result = 'Erreur';
    }
  }

  reutiliserCalcul(calculation: { titre: string, calcul: string, result: string, unite: string }) {
    // Récupérer le calcul à partir de la chaîne
    this.titre = calculation.titre;
    this.calcul = calculation.calcul;
    this.unite = calculation.unite;
    console.log('Titre du calcul réutilisé: ' + this.titre);
    console.log('Calcul réutilisé: ' + this.calcul);
  }

  chargerDansCalculatrice(calculation: { titre: string, calcul: string, result: string, unite: string }) {
    this.titre = calculation.titre;
    this.calcul = calculation.calcul;
    this.result = calculation.result;
    this.unite = calculation.unite;
  }

  effacerDonnees() {
    this.calculations = [];
    localStorage.removeItem('calculations');
  }

  exportCSV() {
    const rows = this.calculations.map(calculation => [calculation.titre, calculation.calcul, calculation.result, calculation.unite].join(','));

    // Créer le contenu CSV en concaténant les lignes
    const csvContent = "data:text/csv;charset=utf-8," + rows.join('\n');

    // Encodage pour éviter les problèmes de caractères spéciaux
    const encodedUri = encodeURI(csvContent);

    // Créer un lien de téléchargement
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "historique_calculs.csv");

    // Ajouter le lien au document et déclencher le téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  
importerCSV(event: any) {
    const fichier = event.target.files[0];
    const lecteur = new FileReader();
  
    lecteur.onload = () => {
      // Récupérer le contenu du fichier CSV
      const contenuCSV: string = lecteur.result as string;
  
      // Traitement du contenu CSV (par exemple, le parsing)
      const lignes: string[] = contenuCSV.split('\n');
  
      // Traiter chaque ligne du fichier CSV
      lignes.forEach(ligne => {
        const valeurs: string[] = ligne.split(',');
        if (valeurs.length === 4) { // Vérifier si la ligne contient toutes les valeurs nécessaires
          const nouveauCalcul = {
            titre: valeurs[0],
            calcul: valeurs[1],
            result: valeurs[2],
            unite: valeurs[3]
          };
          this.calculations.push(nouveauCalcul); // Ajouter l'objet à votre tableau calculations
        }
      });

      // Sauvegarder les données dans le stockage local
      localStorage.setItem('calculations', JSON.stringify(this.calculations));
    };
  
    lecteur.readAsText(fichier);

    this.fichierChoisi = false;
  }
}


