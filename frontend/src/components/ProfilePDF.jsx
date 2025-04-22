// components/FancyPDF.js
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from '@react-pdf/renderer';
import { useUserStore } from '../store/userStore';



const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  header: {  height: 100,    justifyContent: 'center', alignItems: 'center' ,border: "1px solid #000", },
  image: { width: 70, height: 70, marginBottom: 10 },
  table: { display: "table", width: "auto", marginBottom: 10 },
  tableRow: { flexDirection: "row" },
  tableColHeader: {
    //width: "33.33%",
    backgroundColor: "#eee",
    //border: "1px solid #000",
    padding: 5,
    fontWeight: "bold",
    margin:5
  },
  tableCol: {
    width: "100%",
    //border: "1px solid #000",
    padding: 5
  },
  projectName: {
    width: "100%",
    fontWeight: "bold",
    padding: 5
  },
  text:{
    fontSize: 12
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10
  },
  fullCenterBox: {
    height: 40,
    justifyContent: 'center',   // vertical center
    alignItems: 'center',        // horizontal center
    marginBottom: 10,
  },
  textHeader: {
    textAlign: 'center',
    fontSize: 18, 
    marginBottom: 10,
    fontWeight: "bold",
  },
  desc:{
    margin:10
  },
  contact:{
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // optional, for vertical alignment
    marginBottom: 10
  }
});

const ProfilePDF = () => {
   const {userProfile} = useUserStore();
   console.log(userProfile)
   const {imagePath, fullName} = userProfile?.homeInfo || {};
   const {userDesc} = userProfile?.aboutInfo || {};
   const {education,frontend, backend, other,projects, certification, workexp} = userProfile || {};

   console.log(imagePath, fullName, userDesc,frontend,backend, other,projects);
   const fskills = ()=>{
    return frontend && frontend.reduce((prev,skill)=>prev+=skill.skillName+", ","");
   }
   const bskills = ()=>{
    return backend && backend.reduce((prev,skill)=>prev+=skill.skillName+", ","");
   }
   const oskills = ()=>{
    return other && other.reduce((prev,skill)=>prev+=skill.skillName+", ","");
   }

  return (<Document> 
    <Page size="A4" style={styles.page}>
        <View style={styles.fullCenterBox}>            
            <Text style={styles.textHeader}>{fullName}</Text>
        </View>
       
        <View style={styles.contact}>
        <Image src={imagePath|""} style={styles.image} />
        <View >
            <Text style={styles.text}>Email: {userProfile?.email}</Text>
            <Text style={styles.text}>Phone: {userProfile?.phoneNumber}</Text>
        </View>
        </View>

      <View style={styles.desc}>
        <Text style={styles.text}>{userProfile?.homeInfo?.userDesc}</Text>
        <View style={styles.line} /> 
      </View>

      <Text style={styles.tableColHeader}>Technical Background</Text>  
      <Text style={styles.tableCol}>{userDesc}</Text>   

      <Text style={styles.tableColHeader}>Frontend Skills</Text>  
      <Text style={styles.tableCol}>{fskills()}</Text>    

      <Text style={styles.tableColHeader}>Backend Skills</Text>  
      <Text style={styles.tableCol}>{bskills()}</Text>    

      <Text style={styles.tableColHeader}>Other Skills</Text>  
      <Text style={styles.tableCol}>{oskills()}</Text>   

      <Text style={styles.tableColHeader}>Education</Text>  
      {
        education && education.length > 0 && education.map((edu)=>
             (                
                <View>
                <Text style={styles.tableCol}>{edu.name},{edu.university}  ({edu.yearOfPassing})</Text>  
                </View>            
            )
        )
      }

      <Text style={styles.tableColHeader}>Certification</Text>  
      {
        certification && certification.length > 0 && certification.map((cert)=>
             (                
                <View>
                <Text style={styles.tableCol}>{cert.certName} ({cert.certYear})</Text>  
                </View>            
            )
        )
      }

    <Text style={styles.tableColHeader}>Work Experience</Text>  
      {
        workexp && workexp.length > 0 && workexp.map((work)=>
             (                
                <View>
                <Text style={styles.projectName}>{work.expName} ({work.duration})</Text>  
                <Text style={styles.tableCol}>{work.expDesc}</Text>    
                <Text style={styles.tableCol}>Last Designation : {work.lastDesignation}</Text> 
                <View style={styles.line} /> 
                </View>            
            )
        )
      }

     <Text style={styles.tableColHeader}>Featured Projects</Text>  
      {
        projects && projects.length > 0 && projects.map((project)=>
             (                
                <View>
                <Text style={styles.projectName}>{project.projectName}</Text>  
                <Text style={styles.tableCol}>{project.projectDesc}</Text>    
                <Text style={styles.tableCol}>Technologies Used: {project.techUsed}</Text> 
                <View style={styles.line} /> 
                </View>            
            )
        )
      }

    

     
    </Page>
  </Document>)
};

export default ProfilePDF;
