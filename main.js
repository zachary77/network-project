var kind;

function call(kind)
{
  if(kind==1){
    document.getElementById('sum').value =parseInt(document.getElementById('sell1').value);
  }else if(kind==2){
      document.getElementById('sum').value =parseInt(document.getElementById('sell1').value) + parseInt(document.getElementById('sell2').value);
  }else if(kind==3){
      document.getElementById('sum').value =parseInt(document.getElementById('sell1').value) + parseInt(document.getElementById('sell2').value)+ parseInt(document.getElementById('sell3').value);
  }else if(kind==4){
      document.getElementById('sum').value =parseInt(document.getElementById('sell1').value) + parseInt(document.getElementById('sell2').value)+ parseInt(document.getElementById('sell3').value)+ parseInt(document.getElementById('sell4').value);
  }else if(kind==5){
      document.getElementById('sum').value =parseInt(document.getElementById('sell1').value) + parseInt(document.getElementById('sell2').value)+ parseInt(document.getElementById('sell3').value)+ parseInt(document.getElementById('sell4').value)+ parseInt(document.getElementById('sell5').value);
  }else if(kind==6){
      document.getElementById('sum').value =parseInt(document.getElementById('sell1').value) + parseInt(document.getElementById('sell2').value)+ parseInt(document.getElementById('sell3').value)+ parseInt(document.getElementById('sell4').value)+ parseInt(document.getElementById('sell5').value)+ parseInt(document.getElementById('sell6').value);
  }else if(kind==7){
      document.getElementById('sum').value =parseInt(document.getElementById('sell1').value) + parseInt(document.getElementById('sell2').value)+ parseInt(document.getElementById('sell3').value)+ parseInt(document.getElementById('sell4').value)+ parseInt(document.getElementById('sell5').value)+ parseInt(document.getElementById('sell6').value)+ parseInt(document.getElementById('sell7').value);
  }else if(kind==8){
      document.getElementById('sum').value =parseInt(document.getElementById('sell1').value) + parseInt(document.getElementById('sell2').value)+ parseInt(document.getElementById('sell3').value)+ parseInt(document.getElementById('sell4').value)+ parseInt(document.getElementById('sell5').value)+ parseInt(document.getElementById('sell6').value)+ parseInt(document.getElementById('sell7').value)+ parseInt(document.getElementById('sell8').value);
  }else if(kind==9){
      document.getElementById('sum').value =parseInt(document.getElementById('sell1').value) + parseInt(document.getElementById('sell2').value)+ parseInt(document.getElementById('sell3').value)+ parseInt(document.getElementById('sell4').value)+ parseInt(document.getElementById('sell5').value)+ parseInt(document.getElementById('sell6').value)+ parseInt(document.getElementById('sell7').value)+ parseInt(document.getElementById('sell8').value)+ parseInt(document.getElementById('sell9').value);
  }
}

function downloadExcel(targetId,SaveFileName)
  {
    var objDownload =  document.getElementById(targetId); // 테이블
    var oNewDoc = document.createDocumentFragment();                      
    var nLength = objDownload.rows.length;
    var objMeta = oNewDoc.createElement("<meta http-equiv='Content-Type' content='text/html; charset=euc-kr'>");
    var objHead = oNewDoc.createElement("<head>");
    var objHtml = oNewDoc.createElement("<html>");
    var objBody = oNewDoc.createElement("<body>");
    var oCloneNode = objDownload.cloneNode(true);
    objHead.insertBefore(objMeta);
    objHtml.insertBefore(objHead);
    objBody.insertBefore(oCloneNode);
    objHtml.insertBefore(objBody);
    oNewDoc.insertBefore(objHtml);

    if(!SaveFileName)
        {
            SaveFileName='excel.xls';
        }
    oNewDoc.execCommand("SaveAs",true,SaveFileName);
  } 