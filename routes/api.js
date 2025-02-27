'use strict';

const { addReply, getReplies, reportReply, deleteReply } = require('../controllers/replies-controller');
const { createNewThread, getThreads, reportThread, deleteThread } = require('../controllers/thread-controller');
const { generateHash, validatePassword } = require('../password_encryption/password');


const BoardModel = require('../models').Board
const ThreadModel = require('../models').Thread
const ReplyModel = require('../models').Reply

module.exports = function (app) {

  app.route('/api/threads/:board')
    .post(function(req, res) {

      const {text, delete_password} = req.body

      generateHash(delete_password)
      .then(hash => {
        return createNewThread(req.params.board, text, hash)
      })
      .then(thread => {
        res.json(thread)
      })

    })
    .get(function(req, res) {

      getThreads(req.params.board)
      .then(threads => {
        res.json(threads)
      })
    })
    .delete(function(req, res) {

      deleteThread(req.params.board, req.body.thread_id, req.body.delete_password)
      .then(result => {
        res.send(result)
      })
      
    })
    .put(function(req, res) {
      reportThread(req.params.board, req.body.thread_id)
      .then(() => {
        res.send('reported')
      })
    })
    
  app.route('/api/replies/:board')
    .post(function(req, res) {
      generateHash(req.body.delete_password)
      .then(hash => {
        return addReply(req.params.board, req.body.thread_id, req.body.text, hash)
      })
      .then(result => {
        res.json(result)
      })
    })
    .get(function(req, res) {
      getReplies(req.params.board, req.query.thread_id)
      .then(thread=> {
        res.json(thread)
      })
    })
    .delete(function(req, res) {
      deleteReply(req.params.board, req.body.thread_id, req.body.reply_id, req.body.delete_password)
      .then(result => {
        res.send(result)
      })
    })
    .put(function(req, res) {
      reportReply(req.params.board, req.body.thread_id, req.body.reply_id)
      .then(result => {
        res.send(result)
      })
    })

};
