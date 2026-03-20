from app.models.interaction import Interaction

class InteractionRepo:

    @staticmethod
    def create(db, data):
        obj = Interaction(**data)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @staticmethod
    def search(db, name):
        return db.query(Interaction).filter(
            Interaction.hcp_name.ilike(f"%{name}%")
        ).all()

    @staticmethod
    def get_all(db):
        return db.query(Interaction).order_by(
            Interaction.created_at.desc()
        ).all()

    @staticmethod
    def delete(db, interaction_id):
        obj = db.query(Interaction).filter(
            Interaction.id == interaction_id
        ).first()
        if obj:
            db.delete(obj)
            db.commit()
            return True
        return False