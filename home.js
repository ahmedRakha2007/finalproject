
//...............INFINITE SCROLL...................//
document.getElementById("loadMoreBtn").addEventListener("click", () => {
  if (currentPage < lastPage) {
    currentPage++;
    getPosts(currentPage);
  }
});
//...............INFINITE SCROLL...................//
//........................GETTING POSTS FOR THE FIRST TIME...........//
getPosts(currentPage)
//........................GETTING POSTS FOR THE FIRST TIME...........//
function getPosts(page){
  toggleLoader(true)
  axios.get(`${baseUrl}/posts?limit=20&page=${page}`)
.then((res) => {
  toggleLoader(false)
    console.log("the response isssss")
    console.log(res)
    console.log(res.data.data)
    lastPage = res.data.meta.last_page
    const posts = res.data.data
    let postsPage = document.getElementById("posts")
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
    postsPage.innerHTML += `   <div style="cursor:pointer;" class="card mb-4 shadow-lg">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <div onclick="goToProfilePage(${post.author.id})" class="d-flex">
                              <img class="profile-img border border-3" src="${post.author.profile_image}" alt="Profile Picture" width="40" height="40">
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
//.. GETTING POSTS TO THE MAIN PAGE ..//
