/*gloabal Chart*/

export  function ajoutListenerAvis(){
    const piecesElements=document.querySelectorAll(".fiches article button")
    for(let i=0;i<piecesElements.length;i++){
    
        piecesElements[i].addEventListener("click",async function(event) {
            const id=event.target.dataset.id
            const reponse=await fetch("http://localhost:8081/pieces/"+id+"/avis")
            const avis=await reponse.json()
            window.localStorage.setItem(`avis${id}`,JSON.stringify(avis))
            afficherAvis(event.target,avis)
        })
    }
}

export function afficherAvis(pieceElement,avis){
    const avisElement = document.createElement("p");
    for (let i = 0; i < avis.length; i++) {
      avisElement.innerHTML += `${avis[i].utilisateur}:${avis[i].commentaire}<br>`;
    }
    pieceElement.appendChild(avisElement);

}

export function ajoutListenerEnvoyerAvis(){
    const formulaireAvis=document.querySelector(".formulaire-avis")
    formulaireAvis.addEventListener("submit",function(event){
        event.preventDefault()
        const id=event.target.querySelector("[name=piece-id]")
        const nom_utilisateur=event.target.querySelector("[name=utilisateur]")
        const comment=event.target.querySelector("[name=commentaire]")
        const nbre_etoiles=event.target.querySelector("[name=nbEtoiles]")
        const avis={
            pieceId:parseInt(id.value),
            utilisateur:nom_utilisateur.value,
            commentaire:comment.value,
            nbEtoiles:parseInt(nbre_etoiles.value)
        }

        const chargeUtile=JSON.stringify(avis)
        fetch("http://localhost:8081/avis",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:chargeUtile
        }).then(()=>{
            id.value = "";
            nom_utilisateur.value = "";
            comment.value = "";
        });
    })
}

export async function afficherGraphiqueAvis(){
    const avis = await fetch("http://localhost:8081/avis")
            .then((avis) =>avis.json());
    const nb_commentaires=[0,0,0,0,0];

    for(let commentaire of avis){
        nb_commentaires[commentaire.nbEtoiles-1]++;
    }

    const labels=["5","4","3","2","1"];

    const data={
        labels:labels,
        datasets:[{
            label:"Etoiles attribuées",
            data:nb_commentaires.reverse(),
            backgroundColor:"rgba(255,230,0,1)"    
        }]    
    }

    const config={
        type:"bar",
        data:data,
        options:{
            indexAxis:"y"
        }
    }

    new Chart(
      document.querySelector("#avis-graphique"),
      config
    );
}

export async function afficherGraphiquePieces(){
    const avis =await fetch("http://localhost:8081/avis")
                    .then(avis=>avis.json());
    const pieces = await fetch("http://localhost:8081/pieces")
                    .then(piece=>piece.json());

    let nb_comment=[0,0];
    for(let comment of avis){
        if(pieces[comment.pieceId-1].disponibilite) nb_comment[0]++;
        else if(!pieces[comment.pieceId-1].disponibilite) nb_comment[1]++;
    }
    
    const labels=["pièces dispo","pièces indispo"];
    const data = {
      labels: labels,
      datasets: [
        {
          label:"Quantités de commentaires",
          data: nb_comment,
          backgroundColor: "rgba(255,230,0,1)",
        },
      ],
    };
    const config={
        type:"bar",
        data:data,   
        options:{
            indexAxis:"x"
        }     
    }

    new Chart(document.querySelector("#pieces-dispo"),
    config);
    console.log(avis);
    console.log(pieces);
    console.log(data);
}
