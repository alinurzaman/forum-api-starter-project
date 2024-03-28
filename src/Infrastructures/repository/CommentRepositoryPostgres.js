const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DeletedComment = require('../../Domains/comments/entities/DeletedComment');
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

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, threadId, owner, deleted],
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
    const content = '**komentar telah dihapus**';
    const query = {
      text: 'UPDATE comments SET is_deleted = true, content = $2 WHERE id = $1 RETURNING id, content',
      values: [id, content],
    };
    const result = await this._pool.query(query);
    return new DeletedComment({ ...result.rows[0] });
  }
}

module.exports = CommentRepositoryPostgres;
