class GetThreadCommentsUseCase {
  constructor({
    commentRepository,
  }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCaseId) {
    return this._commentRepository.getThreadComments(useCaseId);
  }
}

module.exports = GetThreadCommentsUseCase;
