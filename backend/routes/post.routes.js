import { Router } from "express";
import { activeCheck, createPost, deletePost, getAllPosts, increment_likes } from "../controllers/posts.controller.js";
import { uploadPostMedia } from "../utils/cloudinary.js";
import { commentPost, get_comments_by_post, delete_comment_of_user } from "../controllers/user.controller.js";


const router = Router();

router.route('/').get(activeCheck);
router.route("/post").post(uploadPostMedia.single('media'),createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_comments_by_post);
router.route("/delete_comment").post(delete_comment_of_user);
router.route("/increment_post_like").post(increment_likes);

export default router;