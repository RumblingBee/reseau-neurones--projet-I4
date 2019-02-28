var model;
var compteur = 0;
var fonctionActivation = document.getElementById("fonction_activation").value;
var outputList;



async function run() {

  // On cache le formulaire pendant l'apprentissage
  $("#irisForm").toggle();
  $("#exemple").toggle();
  $("#results").toggle();
  $("#entrainement").toggle();


  var iris = JSON.parse(document.getElementById("training-datas").value);
  model = tf.sequential();


  //On récupère les données correspondant aux paramètres à prendre en compte dans nos entrées
  var parametres;
  parametres = document.getElementById("parametres").value.split(";");

  const trainingData = tf.tensor2d(iris.map(
    function (data) {
      var formattedOutput;
      formattedOutput = [];
      parametres.forEach(element => {
        formattedOutput.push(data[element]);
      });

      return formattedOutput;
    }
  ))
  console.log("item: " + trainingData);

  outputList = document.getElementById("output-list").value.split(";");
  console.log("outputlist: " + outputList);

  //On définie les sorties possibles

  var outputKey = document.getElementById("output-key").value;


  /**
   * On map les sorties des données d'entrainement
   * Exemple, si la sortie est Setosa(première sortie)
   * on aura [1,0,0]
   */

  const outputData = tf.tensor2d(iris.map(
    function (data) {
      var formattedOutput;
      formattedOutput = [];
      outputList.forEach(element => {
        if (data[outputKey] === element) {
          formattedOutput.push(1);
        } else {
          formattedOutput.push(0);
        }
      });
      return formattedOutput;
    }
  ));

  console.log("item: " + outputData);






  // Les entrées
  model.add(tf.layers.dense({
    inputShape: [parametres.length],
    activation: fonctionActivation,
    units: parseInt(document.getElementById("couche_entree").value),
  }))

  for (var j = 1; j <= parseInt(document.getElementById("nb_couches_cachees")); j++) {

    //Pour la première couche cachée
    if (j == 1) {
      model.add(tf.layers.dense({
        inputShape: [parseInt(document.getElementById("couche_entree"))],
        activation: fonctionActivation,
        units: parseInt(document.getElementById("couche_cachee" + j)),
      }))
    }

    //Pour les autres couches cachées
    else if (j > 1) {
      model.add(tf.layers.dense({
        inputShape: [parseInt(document.getElementById("couche_cachee" + (j - 1)))],
        activation: fonctionActivation,
        units: parseInt(document.getElementById("couche_cachee" + j)),
      }))
    }
  }

  // Couche de sortie
  model.add(tf.layers.dense({
    activation: fonctionActivation,
    units: parseInt(document.getElementById("couche_sortie").value),
  }))

  // Fonction d'erreur
  model.compile({
    loss: document.getElementById("fonction_erreur").value,
    optimizer: tf.train.adam(document.getElementById("constante").value),
  })
  // Entrainement du réseau
  model.fit(trainingData, outputData, {
      epochs: document.getElementById("training-number").value
    })
    .then((history) => {

      console.log('entrainement fini!');
      $("#irisForm").toggle();
      $("#entrainement").toggle();
      $("#exemple").toggle();
      $("#results").toggle();
      $("#resultats").toggle();


    })

}

function testData() {

  console.log('test de l entree');

  //On récupère les caractéristiques de l'iris


  var irisTesting = JSON.parse(document.getElementById("testing-datas").value);
  console.log("valeur des données à tester:" + irisTesting);


  const testingData = tf.tensor2d(irisTesting.map(item => [
    item.sepal_length, item.sepal_width, item.petal_length, item.petal_width,
  ]))

  console.log("TESTING DATA:" + testingData);
  // Prédiction des données de test
  model.predict(testingData).print();
  const values = model.predict(testingData);
  
    /*************************************************************************
     * 
     *                    FONCTIONS D AFFICHAGE
     * 
     ************************************************************************/
  

  for (var i = 0; i < Object.keys(irisTesting).length; i++) {

    compteur++;

    var array = Array.prototype.slice.call(values.slice([i, 0], 1).as1D().dataSync());
    
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();

    $("#results").append(
      '<div class="card col-lg-4" id="card_'+ compteur + '">' +
      '<div class="card-body">' +
      '<h5 class="card-title">Test n°' + compteur + '</h5>' 
      );
      
    for(var j = 0; j < outputList.length; j++){
      $("#card_"+compteur).append(
        '<div class="progress">' +
        outputList[j]+
        '<div class="progress-bar bg-success" role="progressbar" style="width: ' + (array[j] * 100) + '%" aria-valuenow="' + (array[j] * 100) + '" aria-valuemin="0" aria-valuemax="100">' +
        Math.round(array[j] * 100) + '%' +
        '</div>' +
        '</div>' 
      );
    } 


  }
  
}




$('#entrainerbtn').click(
  function () {
    run();
  });

$('#testbtn').click(
  function () {
    testData();
  });

$('#nb_couches_cachees').change(
  function () {
    afficherFormCoucheCachee(document.getElementById("nb_couches_cachees").value);
  });


function afficherFormCoucheCachee(value) {
  $("#couches_cachees").empty();
  for (var i = 1; i <= parseInt(value); i++) {
    $("#couches_cachees").append(
      '<div class="form-group">' +
      '<label for="constante">Nombre de neuronnes de la couche cachee numéro' + i + '</label>' +
      '<input type="number"  step="1" value="1" id="couche_cachee' + i + '">' +
      '</div>'

    )

  }


}