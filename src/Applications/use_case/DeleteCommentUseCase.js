class DeleteCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseId, useCaseThreadId, useCaseOwner) {
    await this._threadRepository.verifyExistedThread(useCaseThreadId);
    await this._commentRepository.verifyExistedComment(useCaseId);
    await this._commentRepository.verifyCommentOwner(useCaseId, useCaseOwner);
    await this._commentRepository.deleteComment(useCaseId);
  }
}

module.exports = DeleteCommentUseCase;
