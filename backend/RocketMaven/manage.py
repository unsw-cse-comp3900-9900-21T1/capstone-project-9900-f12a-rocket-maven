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
    from RocketMaven.models import Portfolio
    from RocketMaven.services import ExampleFullSystemService

    db.drop_all()
    db.create_all()

    click.echo("create user")
    ExampleFullSystemService.populate_full_system(db)
    click.echo("created user admin")


if __name__ == "__main__":
    cli()
