Pré-requisitos: Instalar o miniforge para gerar um ambiente isolado e baixar as dependências (https://github.com/conda-forge/miniforge)  
Passos:  
1 - Clone esse repositório  
2 - No cmd, acesse a pasta cd  
3 - Instale o venom-bot: npm install  
4 - Crie o ambiente: mamba env create -f environment.yml  
5 - Ative o ambiente após criar ou sempre que for testar alguma coisa: conda activate chatbot  
6 - Instale o spacy: python -m spacy download pt_core_news_sm  
7 - Quando terminar: conda deactivate  
