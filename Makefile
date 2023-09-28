.PHONY: build
build:
	yarn install && yarn build

# build and copy dist to proxoar/talk
.PHONY: copy
copy:
	make build
	rm -rf ../talk/web/html && cp -r ./build/dist ../talk/web/html

.PHONY: run
run:
	yarn dev

.PHONY: release
release:
	make build
	cd build; \
	tar -czf dist.tar.gz dist; \
	zip -r dist.zip dist;

.PHONY: clean
clean:
	echo "Cleaning up..."
	rm -rf build