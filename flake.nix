{
  description = "The whitecube.netlify.app website";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        packagename = "whitecube.netlify.app";
        pkgs = nixpkgs.legacyPackages.${system};
        builddeps = with pkgs; [
          nodejs_22
        ];
      in
      {
        packages.default = pkgs.buildNpmPackage {
          name = packagename;
          buildInputs = builddeps;
          src = self;
          npmDeps = pkgs.importNpmLock {
            npmRoot = ./.;
          };
          npmConfigHook = pkgs.importNpmLock.npmConfigHook;
          installPhase = ''
            mkdir $out
            cp -r out/. $out/
          '';
        };
        devShell = pkgs.mkShell {
          name = packagename;
          packages = builddeps;
        };
      }
    );
}
