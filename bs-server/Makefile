# Make commands for development
# 
# `make setup` install required Python modules.
# `make build` generates required migrations.
# `make test` runs automated Python tests.
#
# `make sslrun` runs an HTTPS server, listening on port 8000.
# `make run` runs the server, listening on port 8000.

PIP=pip
PYTHON=python

.DEFAULT_GOAL: run

requirements.txt: requirements.in
	$(PIP) install -r requirements.in
	echo "# GENERATED FROM requirements.in.  DO NOT EDIT DIRECTLY." > requirements.txt
	$(PIP) freeze >> requirements.txt

requirements.flag: requirements.txt
	$(PIP) install -r requirements.txt
	touch requirements.flag
	
build: requirements.flag
	$(PYTHON) ./manage.py makemigrations

test: build
	$(PYTHON) ./manage.py test

sslrun: build
	$(PYTHON) ./manage.py migrate
	$(PYTHON) ./manage.py runsslserver

run: build
	echo run
	#$(PYTHON) ./manage.py migrate
	#$(PYTHON) ./manage.py runserver
