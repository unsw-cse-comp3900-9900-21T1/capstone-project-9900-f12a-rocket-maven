import click
from flask.cli import with_appcontext


@click.group()
def cli():
    """Main entry point"""


@cli.command("init")
@with_appcontext
def init():
    """Create a new admin user"""
    from RocketMaven.extensions import db
    from RocketMaven.models import Investor

    db.create_all()

    click.echo("create user")
    user = Investor(
        username="temp_admin", email="admin@mail.com", password="WjjTeWGdylJkH2Pq", active=True
    )
    db.session.add(user)
    db.session.commit()
    click.echo("created user admin")


if __name__ == "__main__":
    cli()
