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
    test_user = db.session.query(Investor).filter_by(username="temp_admin").first()

    if not test_user:
        user = Investor(
            username="temp_admin",
            email="admin@mail.com",
            password="WjjTeWGdylJkH2Pq",
            email_verified=True,
            country_of_residency="AU",
        )
        db.session.add(user)
        db.session.commit()
    click.echo("created user admin")


if __name__ == "__main__":
    cli()
