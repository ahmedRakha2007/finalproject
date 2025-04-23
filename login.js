// HANDLE LOGIN BUTTON //
function handleLoginButton(){
    const username = document.getElementById("username-input").value
    const password = document.getElementById("password-input").value

    const params = {
      username: username,
      password: password
    }
    const url = `${baseUrl}/login`
    toggleLoader(true)
    axios.post(url,params)
    .then((res) => {
      const token = res.data.token
      const user = res.data.user
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      showAlert("User Logged In successfully", "success")
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
//.. HANDEL LOGIN BUTTON ..//