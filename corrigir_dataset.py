#!/usr/bin/env python3
import json
import re
import sys
import unicodedata
from pathlib import Path


INPUT_FILE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("jogos.json")
OUTPUT_FILE = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("dataset.json")


def remove_acentos(texto: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFD", texto)
        if unicodedata.category(c) != "Mn"
    )


def normaliza_nome_campo(campo: str) -> str:
    campo = remove_acentos(campo.strip())
    campo = campo.replace(".", "_")
    campo = re.sub(r"[\s\-]+", "_", campo)
    campo = re.sub(r"[^0-9A-Za-z_]", "", campo)
    return campo


def transforma_objeto(obj, nivel=0):
    if isinstance(obj, list):
        return [transforma_objeto(item, nivel=nivel) for item in obj]

    if isinstance(obj, dict):
        novo = {}

        for chave, valor in obj.items():
            nova_chave = normaliza_nome_campo(chave)

            # id principal do jogo fica como _id
            if nivel == 0 and nova_chave == "id":
                nova_chave = "_id"

            if nova_chave in novo:
                raise ValueError(
                    f"Conflito ao normalizar campos: '{chave}' originou chave repetida '{nova_chave}'."
                )

            novo[nova_chave] = transforma_objeto(valor, nivel=nivel + 1)

        return novo

    return obj


def valida_dataset(jogos):
    if not isinstance(jogos, list):
        raise ValueError("O dataset deve ser uma lista de jogos.")

    ids = []
    for i, jogo in enumerate(jogos, start=1):
        if not isinstance(jogo, dict):
            raise ValueError(f"O registo #{i} não é um objeto JSON.")

        if "_id" not in jogo:
            raise ValueError(f"O registo #{i} não tem campo '_id'.")

        if not jogo["_id"]:
            raise ValueError(f"O registo #{i} tem '_id' vazio.")

        ids.append(jogo["_id"])

    repetidos = sorted({x for x in ids if ids.count(x) > 1})
    if repetidos:
        raise ValueError(f"Existem _id repetidos: {repetidos}")


def main():
    with INPUT_FILE.open("r", encoding="utf-8") as f:
        dados = json.load(f)

    dados_transformados = transforma_objeto(dados)
    valida_dataset(dados_transformados)

    with OUTPUT_FILE.open("w", encoding="utf-8") as f:
        json.dump(dados_transformados, f, ensure_ascii=False, indent=2)

    print(f"Dataset convertido com sucesso: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()