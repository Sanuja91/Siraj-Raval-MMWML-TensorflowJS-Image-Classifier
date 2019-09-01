const classifier = knnClassifier.create()
const webcamElement = document.getElementById("webcam")

let net

const app = async () => {
  document.getElementById("console").innerText = "Loading Mobile Net Neural Network. Please wait.."

  // Load the model.
  net = await mobilenet.load()
  document.getElementById("console").innerText = "Neural Network loaded! Please align the camera to each of the items below and click their respective button"

  await setupWebcam()

  // Reads an image from the webcam and associates it with a specific class
  // index.
  const addExample = classId => {
    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = net.infer(webcamElement, "conv_preds")

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId)
  }

  // When clicking a button, add an example for that class.
  document.getElementById("class-a").addEventListener("click", () => addExample(0))
  document.getElementById("class-b").addEventListener("click", () => addExample(1))
  document.getElementById("class-c").addEventListener("click", () => addExample(2))

  while (true) {
    if (classifier.getNumClasses() > 0) {
      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(webcamElement, "conv_preds")
      // Get the most likely class and confidences from the classifier module.
      const result = await classifier.predictClass(activation)

      const classes = ["Face", "Fan", "Phone"]
      document.getElementById("console").innerText = `Prediction: ${classes[result.classIndex]} with ${(result.confidences[result.classIndex] * 100).toFixed(
        2
      )} % of probability`
    }
    await tf.nextFrame()
  }
}

const setupWebcam = async () => {
  const navigatorAny = navigator
  navigator.getUserMedia = navigator.getUserMedia || navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia || navigatorAny.msGetUserMedia
  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      { video: true },
      stream => {
        webcamElement.srcObject = stream
        webcamElement.addEventListener("loadeddata", () => resolve(), false)
      },
      error => {
        document.getElementById("console").innerText = "Error getting media from Camera"
      }
    )
  } else {
    document.getElementById("console").innerText = "Camera is not available"
  }
}

app()
