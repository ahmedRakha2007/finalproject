let currentPage = 1
let lastPage = 1;
let isLoading = false
const baseUrl = "https://tarmeezacademy.com/api/v1"
setupUI()

//SETUP THE LOGIN AND REGISTER BUTTONS//
function setupUI(){
  const token = localStorage.getItem("token")
  const user = getCurrentUser()
  const addPostBtn = document.getElementById("add-btn")
  const profileImage = document.getElementById("profile-image")
  const userName = document.getElementById("user-name")
  const addComment = document.getElementById("add-comment-container")
  const loginBtn = document.getElementById("login-btn")
  const registerBtn = document.getElementById("register-btn")
  const logoutBtn = document.getElementById("logout-btn")
  const loginBtnDrop = document.getElementById("login-btn-drop")
  const registerBtnDrop = document.getElementById("register-btn-drop")
  const logoutBtnDrop = document.getElementById("logout-btn-drop")

  if(token == null)// user (not logged in)
  {
    loginBtn.style.display = "block"
    registerBtn.style.display = "block"
    logoutBtn.setAttribute("style", "display: none !important")
    loginBtnDrop.style.display = "block"
    registerBtnDrop.style.display = "block"
    logoutBtnDrop.setAttribute("style", "display: none !important")
    if(addPostBtn !== null){
       addPostBtn.style.visibility = "hidden"
    }
    profileImage.setAttribute("style", "display: none !important")
    userName.setAttribute("style", "display: none !important")
    if(addComment){
          addComment.setAttribute("style", "display: none !important;")
    }
  }else{ //FOR LOGGED IN USERS
      loginBtn.setAttribute("style", "display: none !important")
      registerBtn.setAttribute("style", "display: none !important")
      logoutBtn.style.display = "block"
      loginBtnDrop.setAttribute("style", "display: none !important")
      registerBtnDrop.setAttribute("style", "display: none !important")
      logoutBtnDrop.style.display = "block"
      if(addPostBtn !== null){
        addPostBtn.style.visibility = "visible"
     }
      userName.innerHTML = `@${user.username}`
      profileImage.src = user.profile_image
      profileImage.style.display = "block"
      userName.style.display = "block"
      if(addComment){
        addComment.setAttribute("style", "display: flex !important")
  }
  } 

}

//.....SETUP THE LOGIN AND REGISTER BUTTONS....//

//...............GET CURRENT USER..............//
function getCurrentUser(){
  let user = null
  const storageUser = localStorage.getItem("user")
  if(storageUser != null){
    user = JSON.parse(storageUser)
  }
  return user
}
//...............GET CURRENT USER..............//

//LOG OUT//
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  showAlert("You Logged Out Successfully", "success");
  setTimeout(() => {
      setupUI();
  }, 500);
}
//........LOG OUT......//

//...................HANDLE ALERTS.................//
  function showAlert(message, type) {
  const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
// CHECKING IF THE ALERT CONTAINER IS IN THE DOM
  if (!alertPlaceholder) {
      console.error("Error: #liveAlertPlaceholder not found in the DOM!");
      return;
  }
  const buildAlert = (message, type) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
  
    alertPlaceholder.append(wrapper);
     //REMOVE THE ALERT AFTER 3 SECONDES
  setTimeout(() => {
    wrapper.remove()
  }, 5000);
  }
  buildAlert(message, type)
}
//...................HANDLE ALERTS.................//

//...........................CREATE A NEW POST....................//
function createNewPostClicked(){
  let postId = document.getElementById("post-id-input").value
  let isCreate = postId == ""
  const title = document.getElementById("post-title-input").value
  const body = document.getElementById("post-body-input").value
  const image = document.getElementById("post-photo-input").files[0]
  const token = localStorage.getItem("token")
  let url = ``
  const formData = new FormData()
  formData.append("title",title)
  formData.append("body",body)
  formData.append("image",image)
  const headers = {
    "Authorization": `Bearer ${token}`,
  }
  if(isCreate){
    url = `${baseUrl}/posts`
    toggleLoader(true)
    axios.post(url, formData ,{
      headers: headers
    }).then((res) => {
      const modal = document.getElementById("post-modal")
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide()
      showAlert("The Post Has Been Created Successfully","success")
      const postsPage = document.getElementById("posts");
      postsPage.innerHTML = ""; 
      currentPage = 1;
      getPosts(currentPage);
    }).catch((err)=> {
      toggleLoader(false)
      console.error(err)
      const errorMessage = err.response.data.message
      showAlert(errorMessage,"danger")
    })
  }else{
    formData.append("_method", "put")
    url = `${baseUrl}/posts/${postId}`
    toggleLoader(true)
    axios.post(url, formData ,{
      headers: headers
    }).then((res) => {
      const modal = document.getElementById("post-modal")
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide()
      showAlert("The Post Is Updated Successfully","success")
      const postsPage = document.getElementById("posts");
      postsPage.innerHTML = ""; 
      currentPage = 1;
      getPosts(currentPage);
    }).catch((err)=> {
      toggleLoader(false)
      console.error(err)
      const errorMessage = err.response.data.message
      showAlert(errorMessage,"danger")
    })
  }
}
//...........................CREATE A NEW POST....................//
//...........................DELETE POST..........................//
  function confirmDeletePost(){
    let postId = document.getElementById("delete-post-id").value
    url = `${baseUrl}/posts/${postId}`
    const token = localStorage.getItem("token")
    const headers = {
      "Authorization": `Bearer ${token}`,
    }
    toggleLoader(true)
    axios.delete(url,{                               
      headers: headers
    }).then((res) => {
      const modal = document.getElementById("delete-post-modal")
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide()
      showAlert("The Post Has Been Deleted Successfully","success")
      const postsPage = document.getElementById("posts");
      postsPage.innerHTML = ""; 
      currentPage = 1;
      getPosts(currentPage);
    }).catch((err)=> {
      toggleLoader(false)
      console.error(err)
      const errorMessage = err.response.data.message
      showAlert(errorMessage,"danger")
    })
  }
//...........................DELETE POST..........................// 
//...............................................HANDLE DROP DOWN......................................//
function handleDropDown() {
  const dropDownMenu = document.getElementById("dropDown-content");
    if (dropDownMenu.style.display === "none") {
      dropDownMenu.setAttribute("style","display: block !important") // Show the dropdown
    } else {
      dropDownMenu.setAttribute("style","display: none  !important")// Hide the dropdown
    } 
} 
document.addEventListener("click", function (e) {
  const dropdown = document.getElementById("dropDown-content");
  const toggleIcon = document.getElementById("nav-dropDown");

  if (!dropdown.contains(e.target) && !toggleIcon.contains(e.target)) {
    dropdown.style.display = "none";
  }
});

//...............................................HANDLE DROP DOWN......................................//

//...............................HANDLE MODAL BUTTON CLICKED...........................//
function editBtnClicked(postObject){
  let post = JSON.parse(decodeURIComponent(postObject))
  document.getElementById("post-modal-title").innerHTML = "Edit Post"
  document.getElementById("post-id-input").value = post.id
  document.getElementById("post-title-input").value = post.title
  document.getElementById("post-body-input").value = post.body
  document.getElementById("submit-create-post").innerHTML = "Update"
  let postModal = new bootstrap.Modal(document.getElementById("post-modal"),{})
  postModal.toggle()
}
function addPostBtnClicked(){
  document.getElementById("post-modal-title").innerHTML = "Create A New Post"
  document.getElementById("post-title-input").value = ""
  document.getElementById("post-body-input").value = ""
  document.getElementById("post-id-input").value = ""
   document.getElementById("submit-create-post").innerHTML = "Create"
  let postModal = new bootstrap.Modal(document.getElementById("post-modal"),{})
  postModal.toggle()
}
function deletePostBtnClicked(postId){
  document.getElementById("delete-post-id").value = postId
  let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"),{})
  postModal.toggle()
}

//...............................HANDLE MODAL BUTTON CLICKED...........................//

//.................................................GO TO MY PROFILE.............................//
function goToMyProfile(){
  let user = getCurrentUser()
  if(user == null){
    showAlert("You Must Log In First","danger")
  }else{
    window.location = `profile.html?userId=${user.id}`
  }
}
//.................................................GO TO MY PROFILE.............................//
//...............GO TO POST DETAILS............//
function getPostDetails(postId){
  window.location = `post-details.html?postId=${postId}`
}
//...............GO TO POST DETAILS............//
//...............GO TO PROFILE PAGE............//
function goToProfilePage(userId){
  window.location = `profile.html?userId=${userId}`
}
//...............GO TO PROFILE PAGE............//
function toggleLoader(show){
  if(show == true){
    document.getElementById("loader").style.visibility = "visible"
  }else{
     document.getElementById("loader").style.visibility = "hidden"
  }
}

