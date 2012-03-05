from hyde.plugin import Plugin
from jinja2 import environmentfilter
from softhyphen.html import hyphenate

@environmentfilter
def justice(env, value, language='en-us'):
	return hyphenate(value, language=language)

class RoughJusticePlugin(Plugin):
	def __init__(self, site):
		super(RoughJusticePlugin, self).__init__(site)

	def begin_site(self):
		self.template.env.filters['justice'] = justice
