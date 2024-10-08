"""Unique constraints

Revision ID: fcd0be8495da
Revises: 1f84e2b6843a
Create Date: 2024-08-09 19:34:02.104464+00:00

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "fcd0be8495da"
down_revision: Union[str, None] = "1f84e2b6843a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(
        "_action_project_key_value", "event", ["action", "project_key", "value"]
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint("_action_project_key_value", "event", type_="unique")
    # ### end Alembic commands ###
