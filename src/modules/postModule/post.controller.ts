import { Router } from "express";
import { PostServices } from "./post.services";
import { auth } from "../../middleware/auth.middleware";

const postRouter=Router()
const postServices=new PostServices()

postRouter.post('/create-post',auth,postServices.createPost)
postRouter.patch('/freeze-post/:id',postServices.freezePost)
postRouter.delete('/delete-post/:id',auth,postServices.deletePost)
postRouter.patch('/update-post/:id',auth,postServices.updatePost)
postRouter.get('/get-post-by-id/:id',postServices.getPost)

export default postRouter