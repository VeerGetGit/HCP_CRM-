from app.repositories.interaction_repo import InteractionRepo

class InteractionService:

    @staticmethod
    def create(db, data):
        return InteractionRepo.create(db, data)

    @staticmethod
    def search(db, name):
        return InteractionRepo.search(db, name)

    @staticmethod
    def get_all(db):
        return InteractionRepo.get_all(db)

    @staticmethod
    def delete(db, interaction_id):
        return InteractionRepo.delete(db, interaction_id)