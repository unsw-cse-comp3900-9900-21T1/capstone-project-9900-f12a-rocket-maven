import click
from flask.cli import with_appcontext
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "settings.env"))

@click.group()
def cli():
    """Main entry point"""


@cli.command("init")
@with_appcontext
def init():
    """Populate system with example data"""
    from RocketMaven.extensions import db
    from RocketMaven.services import ExampleFullSystemService

    if os.environ.get("RECREATE_DB_ON_START", "true") == "true":
        print("recreating database")
        db.drop_all()
        db.create_all()
        print("recreated database")

    click.echo("populate system")
    ExampleFullSystemService.populate_full_system(db)
    click.echo("populated system")


if __name__ == "__main__":
    cli()
