const urlParams = new URLSearchParams(window.location.search)
const userId = urlParams.get("userId")
//......................................GET USER INFORMATION.............................//
getPersonalInformation()
getUserPosts()
function getPersonalInformation() {
  toggleLoader(true)
  axios.get(`${baseUrl}/users/${userId}`)
    .then((res) => {
      toggleLoader(false)
      const profile = res.data.data;
      let email = profile.email
      if(profile.email == null){
         email = ""
      }

      let content = `
        <div class="text-center text-lg-start">
          <img src="${profile.profile_image}" alt="Profile Image"
            class="rounded-circle border border-2 shadow"
            style="width: 100px; height: 100px; object-fit: cover;">
        </div>

        <div class="d-flex flex-column align-items-center align-items-lg-start text-center text-lg-start gap-2">
          <div class="fs-5 fw-bold text-danger">${profile.name}</div>
          <div class="text-muted small">@${profile.username}</div>
          <div class="text-muted small">${email}</div>
        </div>

        <div class="d-flex flex-column flex-sm-row justify-content-center gap-4 text-center">
          <div>
            <div class="fs-4 text-danger fw-bold">${profile.posts_count}</div>
            <div class="text-muted small">Posts</div>
          </div>
          <div>
            <div class="fs-4 text-danger fw-bold">${profile.comments_count}</div>
            <div class="text-muted small">Comments</div>
          </div>
        </div>
      `;

      document.getElementById("profile-card-container").innerHTML = content;
    })
    .catch((err) => {
      console.error(err);
    });
}
//......................................GET USER INFORMATION.............................//

//........................................GET USER POSTS.................................//


function getUserPosts(){
axios.get(`${baseUrl}/users/${userId}/posts`)
.then((res) => {
console.log(res.data.data)
const posts = res.data.data
let userPostsPage = document.getElementById("user-posts")
posts.forEach(post => {
let postTitle = ""
if(post.title != null){
   postTitle = post.title
}
//SHOW OR HIDE (EDIT) BUTTON
let user = getCurrentUser()
let isMyPost = user != null && post.author.id == user.id
let editBtnContent = ``
let deleteBtnContent = ``
if(isMyPost){
 editBtnContent = `
         <div id="editBtn" onclick="editBtnClicked('${encodeURIComponent(JSON.stringify(post))}')" class="text-white rounded-1 py-1 px-2 ms-2">
         edit
         </div>`
 deleteBtnContent = `
       <div onclick = "deletePostBtnClicked(${post.id})">
       <i id = "trash-icon" class="fa-solid fa-trash fa-xl ms-2"></i>
       </div>
   `         
}
document.getElementById("u-posts").innerHTML = `${post.author.username}'s Posts`
userPostsPage.innerHTML += `   <div style="cursor:pointer;" class="card mb-4 shadow-lg mt">
               <div class="card-header d-flex align-items-center justify-content-between">
                   <div onclick="goToProfilePage(${post.author.id})" class="d-flex">
                     <img class="profile-img border border-3 rounded-circle" src="${post.author.profile_image}" alt="Profile Picture" width="40" height="40">
                     <h2 class="fs-6 ms-2 fw-bolder" style="margin-top: 11px">@${post.author.username}</h2>
                   </div>
                   <div class="d-flex align-items-center">
                       ${editBtnContent}
                       ${deleteBtnContent}
                   </div>
               </div>
               <div class="card-body" onclick="getPostDetails(${post.id})">
                   <img class="post-img img-fluid" src="${post.image}" alt="photo">
                   <h2 class="fs-6 fw-lighter">${post.created_at}</h2>
                 <h5 class="card-title">${postTitle}</h5>
                 <p class="card-text">${post.body}</p>
                 <hr>
                 <div class="d-flex align-items-center">
                   <i class="fa-solid fa-pen me-2 mb-2"></i>
                   <h2 class="fs-5 fw-light">(${post.comments_count}) Comments</h2>
                 </div>
               </div>
             </div>`
})
}).catch((err) => {
console.error(err)
})
}

//........................................GET USER POSTS.................................//