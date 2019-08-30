const version = 2
const alpha = 0.5

const app = async () => {
  console.log("Loading image classifier..")

  const model = await mobilenet.load()
  console.log("Sucessfully loaded model")

  const image = document.getElementById("image")
  const uploadBtn = document.getElementById("upload")
  const firstResult = document.getElementById("first_result")
  const secondResult = document.getElementById("second_result")
  const thirdResult = document.getElementById("third_result")

  uploadBtn.addEventListener("change", ev => {
    let f = ev.target.files[0]
    let fr = new FileReader()
    fr.onload = async ev2 => {
      image.src = ev2.target.result

      let predictions = await model.classify(image)
      console.log("Predictions")
      console.log(predictions)
      firstResult.textContent = `1) PROBABILITY = ${predictions[0].probability.toFixed(2)}% | CLASS NAME = ${predictions[0].className}`
      secondResult.textContent = `2) PROBABILITY = ${predictions[1].probability.toFixed(2)}% | CLASS NAME = ${predictions[1].className}`
      thirdResult.textContent = `3) PROBABILITY = ${predictions[2].probability.toFixed(2)}% | CLASS NAME = ${predictions[2].className}`
    }
    fr.readAsDataURL(f)
  })
}

app()