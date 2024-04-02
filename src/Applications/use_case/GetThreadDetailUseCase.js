const ThreadComment = require('../../Domains/comments/entities/ThreadComment');

class GetThreadDetailUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseId) {
    const thread = await this._threadRepository.getThreadDetail(useCaseId);
    const comments = await this._commentRepository.getThreadComments(useCaseId);
    const validatedComments = [];
    comments.forEach((comment) => {
      if (comment.isDeleted === true) {
        validatedComments.push(new ThreadComment({
          id: comment.id,
          username: comment.username,
          date: comment.date,
          content: '**komentar telah dihapus**',
        }));
      } else {
        validatedComments.push(new ThreadComment({ ...comment }));
      }
    });
    thread.comments = validatedComments;
    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
