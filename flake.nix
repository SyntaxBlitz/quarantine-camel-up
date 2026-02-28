{
  description = "Reproducible build shell for quarantine-camel-up";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";

  outputs = {
    self,
    nixpkgs,
    ...
  }: let
    systems = [
      "x86_64-linux"
      "aarch64-linux"
      "x86_64-darwin"
      "aarch64-darwin"
    ];
    forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f (import nixpkgs {
      inherit system;
    }));
  in
  {
    devShells = forAllSystems (pkgs: {
      default = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs_18
          pkgs.nodePackages.npm
        ];

        shellHook = ''
          export NODE_OPTIONS="--openssl-legacy-provider"
        '';
      };
    });

    apps = forAllSystems (pkgs: {
      build = let
        buildScript = pkgs.writeShellScriptBin "quarantine-camel-up-build" ''
          set -euo pipefail
          WORKDIR=$(mktemp -d)
          trap 'rm -rf "$WORKDIR"' EXIT
          cp -r ${self}/. "$WORKDIR"/
          chmod -R u+rwX "$WORKDIR"
          cd "$WORKDIR"
          export NODE_OPTIONS="--openssl-legacy-provider"
          npm config set fund false
          npm config set audit false
          npm config set cache "$WORKDIR/.npm"
          npm ci
          npm run build
        '';
      in {
        type = "app";
        program = "${buildScript}/bin/quarantine-camel-up-build";
      };
    });

    packages = forAllSystems (pkgs: {
      default = pkgs.stdenv.mkDerivation {
        pname = "quarantine-camel-up";
        version = "0.0.0";
        src = self;

        nativeBuildInputs = [
          pkgs.nodejs_18
          pkgs.nodePackages.npm
        ];

        buildPhase = ''
          WORKDIR=$(mktemp -d)
          trap 'rm -rf "$WORKDIR"' EXIT
          cp -r . "$WORKDIR"/
          chmod -R u+rwX "$WORKDIR"
          cd "$WORKDIR"
          export NODE_OPTIONS="--openssl-legacy-provider"
          npm config set fund false
          npm config set audit false
          npm config set cache "$WORKDIR/.npm"
          npm ci
          npm run build
        '';

        installPhase = ''
          mkdir -p "$out"
          cp -r build/. "$out/"
        '';
      };
    });
  };
}
