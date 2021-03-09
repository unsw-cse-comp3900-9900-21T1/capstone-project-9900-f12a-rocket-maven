import factory
from RocketMaven.models import Investor


class InvestorFactory(factory.Factory):

    username = factory.Sequence(lambda n: "user%d" % n)
    email = factory.Sequence(lambda n: "user%d@mail.com" % n)
    country_of_residency = "AU"
    password = "mypwd"
    email_verified = True

    class Meta:
        model = Investor
