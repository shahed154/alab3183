const express = require("express");
const router = express.Router();

const comments = require("../data/comments");
const error = require("../utilities/error");

// POST /comments
// When creating a new comment object, it should have the following fields:
// id: a unique identifier.
// userId: the id of the user that created the comment.
// postId: the id of the post the comment was made on.
// body: the text of the comment.

router.post("/", (req, res, next) => 
    {
    try 
    {
    

      const comment = 
      {
        id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
        userId: req.body.userId,
        postId: req.body.postId,
        body: req.body.body
      };
      if (!req.body.userId || !req.body.postId || !req.body.body) {
        throw error(400, "complet all fields. client error ");
      }

      comments.push(comment);
      

      res.json(comment);
    } catch (err) {
 
      next(err);
    }

});

// GET /comments/:id
// Retrieves the comment with the specified id.

// i just copied this from users.js and changed it to comment LOL

router
  .route("/:id")
  .get((req, res, next) => {
    const comment = comments.find((c) => c.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (comment) res.json({ comment, links });
    else next();
  })

// also copied from users

  .patch((req, res, next) => {
    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        for (const key in req.body) {
          comments[i][key] = req.body[key];
        }
        return true;
      }
    });
  
    if (comment) res.json(comment);
    else next();
  })

// also copied from users


  .delete((req, res, next) => {
    const comment = comments.find((u, i) => {
      if (u.id == req.params.id) {
        comments.splice(i, 1);
        return true;
      }
    });

    if (comment) res.json(comment);
    else next();
  });




router.route("/").get((req, res) =>
    
     {

    const { postId, userId } = req.query;
    let results = comments;
    
    if (postId) {
      results = results.filter(comment => comment.postId == postId);
    }

    if (userId) {
      results = results.filter(comment => comment.userId == userId);
    }
    
    res.json({ comments: results });
  });