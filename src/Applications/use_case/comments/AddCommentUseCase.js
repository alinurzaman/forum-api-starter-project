const AddComment = require('../../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, useCaseThreadId, useCaseOwner) {
    await this._threadRepository.verifyExistedThread(useCaseThreadId);
    const addComment = new AddComment(useCasePayload);
    return this._commentRepository.addComment(addComment, useCaseThreadId, useCaseOwner);
  }
}

module.exports = AddCommentUseCase;
