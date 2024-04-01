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
    thread.comments = await this._commentRepository.getThreadComments(useCaseId);
    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
