var model;
var compteur = 0;



async function run() {

  // On cache le formulaire pendant l'apprentissage
  $("#irisForm").toggle();
  $("#exemple").toggle();
  $("#results").toggle();


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

  var outputList = document.getElementById("output-list").value.split(";");
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
    inputShape: [4],
    activation: "sigmoid",
    units: 4,
  }))

  // Première couche cachée
  model.add(tf.layers.dense({
    inputShape: [5],
    activation: "sigmoid",
    units: 3,
  }))

  // Couche de sortie
  model.add(tf.layers.dense({
    activation: "sigmoid",
    units: 3,
  }))

  // Fonction d'erreur
  model.compile({
    loss: "meanSquaredError",
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


    })

}

function testData() {

  console.log('test de l entree');

  //On récupère les caractéristiques de l'iris
  /*
  var sepalLength = parseFloat(document.getElementById("sepal_length").value);
  var sepalWidth = parseFloat(document.getElementById("sepal_width").value);
  var petalLength = parseFloat(document.getElementById("petal_length").value);
  var petalWidth = parseFloat(document.getElementById("petal_width").value);
*/

  var irisTesting = JSON.parse(document.getElementById("testing-datas").value);
  console.log("valeur des données à tester:" + irisTesting);

  /*
  irisTesting[0]['sepal_length'] = sepalLength;
  irisTesting[0]['sepal_width'] = sepalWidth;
  irisTesting[0]['petal_length'] = petalLength;
  irisTesting[0]['petal_width'] = petalWidth;
  */

  const testingData = tf.tensor2d(irisTesting.map(item => [
    item.sepal_length, item.sepal_width, item.petal_length, item.petal_width,
  ]))

  console.log(irisTesting);
  // Prédiction des données de test
  model.predict(testingData).print();
  const values = model.predict(testingData);


  for (var i = 0; i < Object.keys(irisTesting).length; i++) {

    var array = Array.prototype.slice.call(values.slice([i, 0], 1).as1D().dataSync());

    console.log("setosa: " + array[0]);

    console.log("virginica: " + array[1]);

    console.log("versicolor: " + array[2]);

  }



  compteur++

  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();

  $("#results").append(
    '<div class="card col-lg-4">' +
    '<div class="card-body">' +
    '<h5 class="card-title">Test n°' + compteur + '</h5>' +
    '<div class="progress">' +
    'SETOSA : ' +
    '<div class="progress-bar bg-success" role="progressbar" style="width: ' + (array[0] * 100) + '%" aria-valuenow="' + (array[0] * 100) + '" aria-valuemin="0" aria-valuemax="100">' +
    Math.round(array[0] * 100) + '%' +
    '</div>' +
    '</div>' +
    '<div class="progress">' +
    'VERSICOLOR : ' +
    '<div class="progress-bar bg-info" role="progressbar" style="width: ' + (array[2] * 100) + '%" aria-valuenow="' + (array[2] * 100) + '" aria-valuemin="0" aria-valuemax="100">' +
    Math.round(array[2] * 100) + '%' +
    '</div>' +
    '</div>' +
    '<div class="progress">' + 'VIRGINICA : ' +
    '<div class="progress-bar bg-danger" role="progressbar" style="width: ' + (array[1] * 100) + '%" aria-valuenow="' + (array[1] * 100) + '" aria-valuemin="0" aria-valuemax="100">' +
    Math.round(array[1] * 100) + '%' +
    '</div>' +
    '</div>' +
    '<div class="card-footer">' +
    '<small class="text-muted">Date de mise à jour ' + h + ':' + m + ':' + s + '</small>' +
    '</div>' +
    '</div>'
  );

}

run();



$('#testbtn').click(
  function () {
    testData();
  });