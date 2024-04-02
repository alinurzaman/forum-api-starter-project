const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DeletedComment = require('../../Domains/comments/entities/DeletedComment');
const RawComment = require('../../Domains/comments/entities/RawComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment, threadId, owner) {
    const { content } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const deleted = false;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, threadId, owner, deleted, date],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyExistedComment(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new AuthorizationError('anda tidak berhak menghapus komentar ini');
    }
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1 RETURNING id, is_deleted',
      values: [id],
    };
    const result = await this._pool.query(query);
    const comment = result.rows[0];
    return new DeletedComment({ id: comment.id, isDeleted: comment.is_deleted });
  }

  async getThreadComments(threadId) {
    const query = {
      text: `SELECT comments.id, users.username, date, content, is_deleted  
      FROM comments 
      JOIN users ON users.id = comments.owner
      WHERE comments.thread_id = $1 
      ORDER BY date ASC`,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    const comments = [];
    result.rows.forEach((comment) => {
      comments.push(new RawComment({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
        isDeleted: comment.is_deleted,
      }));
    });
    return comments;
  }
}

module.exports = CommentRepositoryPostgres;
