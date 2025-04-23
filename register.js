// HANDLE REGISTER BUTTON //
function handleRegisterButton(){
    const name = document.getElementById("name-input").value
    const username = document.getElementById("username-input").value
    const email = document.getElementById("email-input").value
    const password = document.getElementById("password-input").value
    const image = document.getElementById("profile-pic").files[0]
   
    const url = `${baseUrl}/register`
    
    const formData = new FormData()
    formData.append("name",name)
    formData.append("username",username)
    formData.append("email",email)
    formData.append("password",password)
    formData.append("image",image)
    toggleLoader(true)
    axios.post(url,formData)
    .then((res) => {
      const token = res.data.token
      const user = res.data.user
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      showAlert("User Sign Up successfully", "success")
      setTimeout(() => {
        window.location = "home.html";
      }, 500);
      setupUI()
    })
    .catch((error) => {
      console.error(error)
      const errorMessage = error.response.data.message
      showAlert(errorMessage, "danger")
    }).finally(()=>{
      toggleLoader(false)
    })
  }
  //.. HANDEL REGISTER BUTTON ..//