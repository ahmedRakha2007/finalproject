const urlParams = new URLSearchParams(window.location.search)
   const postId = urlParams.get("postId")
    console.log(postId)
    getPost()
    function getPost(){
        toggleLoader(true)
        axios.get(`${baseUrl}/posts/${postId}`)
        .then((res)=>{
            toggleLoader(false)
            const post = res.data.data
            const comments = post.comments
            const author = post.author
            let postTitle = ""
            if(post.title != null){
                let postTitle = post.title
            }
            console.log(post)
            let content =  document.getElementById("post")
            content.innerHTML = `  <h1 class="text-light"><span class="text-light">${author.username}'s</span> Post</h1>
                <div class="card mb-4 shadow-lg mt-4">
                    <div class="card-header d-flex align-items-center" onclick="goToProfilePage(${post.author.id})" style="cursor: pointer;">
                        <img class="profile-img border border-3 rounded-circle" src="${author.profile_image}" alt="Profile Picture" width="40" height="40">
                      <h2 class="fs-6 mt-2 ms-2 fw-bolder">@${author.username}</h2>
                    </div>
                    <div class="card-body">
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
                    <div id="comments-container" class="rounded-2 mb-1" style="background-color: rgb(123,0,0); padding: 20px 0px 20px 0px; ">
                      
                    </div>
                        <!--ADD COMMENT-->
                        <div id="add-comment-container" class="py-2 d-flex">
                            <input placeholder="Write A Comment..." id="add-comment-input" type="text" class="rounded-5 rounded-end-0 shadow-lg px-2 ms-1 w-100">
                            <button onclick="addComment()" class=" btn text-light me-1 rounded-5 rounded-start-0" style="height: 60px;  background-color: rgb(150,0,0) !important;">Add comment</button>
                        </div>
                        <!--ADD COMMENT-->
                  </div>
                  `
                  //................GET COMMENTS.............//
                  let commentsContent = ``
                  for (comment of comments) {
                    commentsContent += `
                    <!--COMMENT CONTAINER-->
                        <div id="comment-container">
                            <div class="d-flex ms-2 align-items-center">
                                <img class="rounded-circle" style="width: 40px; height: 40px;" src="${comment.author.profile_image}" alt="profile-image">
                                <h2 class="ms-2 fs-5 fw-bold text-light">@${comment.author.username}</h2>
                            </div>
                            <h2 class="text-light fs-6 mt-3 ms-5">${comment.body}</h2>
                        </div>
                        <hr>
                        <!--///////COMMENT CONTAINER///////////-->`
                  }
                  document.getElementById("comments-container").innerHTML = commentsContent
                  if(commentsContent == ""){
                    document.getElementById("comments-container").style.padding = "0px"
                  }
               
                 //................GET COMMENTS.............//
                 setupUI()
                 
            })
    }

         let token = localStorage.getItem("token")  
        function addComment(){
            const body = document.getElementById("add-comment-input").value
            const bodyParams = {
                "body": body
            }
            const headers = {
                "Authorization" : `Bearer ${token}`
            }
            axios.post(`${baseUrl}/posts/${postId}/comments`,bodyParams, {
                headers: headers
            })
            .then((res)=> {
                console.log(res.data.data)
                getPost()
            }).catch((error) => {
                console.log(error)
            const errorMessage = error.response.data.message
            showAlert(errorMessage, "danger")
            
            })
        }      